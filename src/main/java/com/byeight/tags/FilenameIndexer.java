package com.byeight.tags;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexWriterConfig.OpenMode;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;

import com.byeight.manifest.bo.Item;

public class FilenameIndexer implements Collector {

    private Path mediaDir, indexDir;
    private String parentPath;
    private boolean stopRequested;
    private boolean ready = false;
    private Pattern nameExclusion;

    public FilenameIndexer(Path mediaDir, Path indexDir) {
        super();
        this.mediaDir = mediaDir;
        this.indexDir = indexDir;
        parentPath = mediaDir.getParent().toString()+"/";
        nameExclusion = Pattern.compile("^\\..*|^thumb:.*|^manifest.json$|^[a-z]{3,5}_?\\d+.*|^p\\d+.*", Pattern.CASE_INSENSITIVE);
    }

    @Override
    public void run() {
        try {
            Directory dir = FSDirectory.open(indexDir);
            Analyzer analyzer = new StandardAnalyzer();
            IndexWriterConfig iwc = new IndexWriterConfig(analyzer);
            iwc.setOpenMode(OpenMode.CREATE);
            IndexWriter writer = new IndexWriter(dir, iwc);
            indexPath(writer, mediaDir);
            writer.close();
            ready = true;

            try (WatchService service = mediaDir.getFileSystem().newWatchService()) {
                mediaDir.register(service,
                        StandardWatchEventKinds.ENTRY_CREATE,
                        StandardWatchEventKinds.ENTRY_MODIFY,
                        StandardWatchEventKinds.ENTRY_DELETE);

                while (!stopRequested) {
                    WatchKey key = service.take();
                    List<WatchEvent<?>> events = key.pollEvents();
                    if (events.size() > 0) {
                        System.out.println("Directory contents changed.  Re-index starting at "+new Date().toString());
                        iwc = new IndexWriterConfig(analyzer);
                        iwc.setOpenMode(OpenMode.CREATE);
                        writer = new IndexWriter(dir, iwc);
                        indexPath(writer, mediaDir);
                        writer.close();
                    }
                }
                service.close();
            }
            finally {
                writer.close();
            }
        }
        catch (IOException ex) {
            ex.printStackTrace();
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private boolean indexPath(IndexWriter writer, Path path) throws IOException {
        System.out.println("Indexing '"+path.toString()+"'");
        String itemName = path.getFileName().toString();
        Document doc = new Document();
        String relativePath = path.toString().substring(parentPath.length());
        Field pathField = new StringField("path", relativePath, Field.Store.YES);
        doc.add(pathField);
        doc.add(new TextField("contents", itemName, Field.Store.YES));

        File asFile = path.toFile();
        if (asFile.isDirectory()) {
            File[] files = asFile.listFiles(new FileFilter() {
                @Override
                public boolean accept(File pathname) {
                    String name = pathname.getName();
                    boolean exclude = name.startsWith(".");
                    if (pathname.isFile()) {
                        Matcher m = nameExclusion.matcher(pathname.getName());
                        exclude = m.matches();
                    }
                    return !exclude;
                }});
            for (File file : files) {
                indexPath(writer, file.toPath());
            }
        }
        /*
         * Figure out file type
         */
        else {
            String type = Item.getType(path.toString());
            doc.add(new StringField("type", type, Field.Store.YES));
        }
        writer.addDocument(doc);
        return true;
    }

    @Override
    public void stop() {
        stopRequested = true;
    }

    @Override
    public boolean isReady() {
        return ready;
    }

}

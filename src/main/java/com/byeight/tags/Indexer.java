package com.byeight.tags;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.store.FSDirectory;

public class Indexer {
    private static Indexer instance;
    private QueryParser parser;
    private Path indexDir;
    private ArrayList<Collector> collectors;

    public static Indexer instance(String mediaPath) throws IOException {
        if (!mediaPath.endsWith("/")) {
            mediaPath += "/";
        }
        String indexPath = mediaPath+".lucene/";
        return instance(mediaPath, indexPath);
    }
    /**
     * Get the instance of the Indexer
     * @param mediaPath
     * @return
     * @throws IOException
     */
    public static Indexer instance(String mediaPath, String indexPath) throws IOException {
        if (instance == null) {
            instance = new Indexer(mediaPath, indexPath);
        }
        return instance;
    }

    /**
     * Instantiate the instance with the given documents directory
     * @param mediaPath
     * The directory where the documents to be indexed are kept
     * @throws IOException
     */
    private Indexer(String mediaPath, String indexPath) throws IOException {
        Path mediaDir = Paths.get(mediaPath);
        indexDir = Paths.get(indexPath);
        /*
         * Start Collectors
         */
        collectors = new ArrayList<>();
        collectors.add(new FilenameIndexer(mediaDir, indexDir));
        for (Collector c : collectors) {
            new Thread(c).start();
        }
        /*
         * Reader
         */
        Analyzer analyzer = new StandardAnalyzer();
        parser = new QueryParser("contents", analyzer);
    }

    public List<Tag> query(String term) {
        ArrayList<Tag> result = new ArrayList<>();
        try {
            Query query = parser.parse(term);
            IndexReader reader = DirectoryReader.open(FSDirectory.open(indexDir));
            IndexSearcher searcher = new IndexSearcher(reader);
            ScoreDoc[] hits = searcher.search(query, 100).scoreDocs;
            for (ScoreDoc scoreDoc : hits) {
                Document doc = searcher.doc(scoreDoc.doc);
                String path = doc.get("path");
                String type = doc.get("type");
                Tag tag = new Tag(path, type, "");
                result.add(tag);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * Tells whether all collectors have finished their indexing tasks and
     * queries can now begin.
     * @return
     */
    public boolean isReady() {
        boolean ready = true;
        for (Collector c : collectors) {
            if (!c.isReady()) {
                ready = false;
                break;
            }
        }
        return ready;
    }

    /**
     * Stop all collectors
     */
    public void stop() {
        for (Collector c : collectors) {
            c.stop();
        }
    }

}

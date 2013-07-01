package com.byeight.composer;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.byeight.composer.compress.Compressor;

public abstract class AbstractWebContentWorker implements ContentWorker {

    private String matchPattern = "\\(['\"]([-\\w\\.\\/]*)['\"]";
    private Pattern requiresPattern = Pattern.compile("by8\\.require"+matchPattern);
    private Pattern includePattern = Pattern.compile("by8\\.include"+matchPattern);

    private final String compiledSuffix = "-compiled";
    private File parentDir;

    private Compressor compressor;

    public AbstractWebContentWorker(File parentDir, Compressor compressor) {
        this.parentDir = parentDir;
        this.compressor = compressor;
    }
    
    @Override
    public String getContents(String sourcePath) throws IOException {
        File source = new File(parentDir, sourcePath);
        File cache = new File(parentDir, sourcePath+compiledSuffix);
        /*
         * If cache is stale, rebuild
         */
        if (source.exists() &&
                (!cache.exists() || lastModified(sourcePath) > cache.lastModified())) {
            PrintWriter pr = new PrintWriter(cache);
            String contents = readContents(sourcePath);
            pr.print(contents);
            pr.close();
        }
        return readFile(sourcePath+compiledSuffix);
    }
    
    private String readContents(String sourcePath) throws IOException {
        StringBuffer buff = new StringBuffer();
        List<String> deps = getDependencies(sourcePath);
        ArrayList<String> included = new ArrayList<String>(deps.size());
        for (String dep : deps) {
            /*
             * Prevent duplicates
             */
            if (!included.contains(dep)) {
                buff.append(
                        "\n/*!\n * "+dep+"\n */\n"+
                        readFile(dep)
                );
                included.add(dep);
            }
        }
        String sanitized = removeRequireCalls(buff.toString());
        byte[] compressed = compressor.compress(sanitized);
        return new String(compressed);
    }

    private String readFile(String resource) throws IOException {
        StringBuffer buff = new StringBuffer();
        BufferedReader br = new BufferedReader(new InputStreamReader(
                new FileInputStream(new File(parentDir, resource))));
        String line;
        while ((line = br.readLine()) != null) {
            buff.append(line+"\n");
        }
        br.close();
        return buff.toString();
    }

    @Override
    public long lastModified(String sourcePath) throws IOException {
        long latest = 0L;
        List<String> deps = getDependencies(sourcePath);
        for (String dep : deps) {
            File file = new File(parentDir, dep);
            if (file.lastModified() > latest) {
                latest = file.lastModified();
            }
        }
        return latest;
    }
    
    /**
     * Get a list of dependent files related to the sourcePath.  This method
     * only adds the original sourcePath into the list.  Subclasses should
     * extend to add more dependencies.
     * 
     * @param sourcePath
     * @return
     */
    private List<String> getDependencies(String sourcePath) throws IOException {
        ArrayList<String> deps = new ArrayList<String>();
        deps.add(sourcePath);
        String source = readFile(sourcePath);
        
        /*
         * First, find by8.requires() statements; push into separate array which
         * will be prepended to final deps array.
         */
        Matcher m = requiresPattern.matcher(source);
        ArrayList<String> requiresArray = new ArrayList<String>(m.groupCount());
        while (m.find()) {
            String depPath = getPathFromModule(m.group(1));
            requiresArray.add(depPath);
            List<String> nestedDeps = getDependencies(depPath);
            if (nestedDeps.size() > 1) {
                requiresArray.addAll(0, nestedDeps.subList(0, nestedDeps.size()-1));
            }
        }
        deps.addAll(0, requiresArray);
        
        /*
         * Next, find by8.include() statements; add to end of list
         */
        m = includePattern.matcher(source);
        while (m.find()) {
            String depPath = getPathFromModule(m.group(1));
            deps.add(depPath);
            List<String> nestedDeps = getDependencies(depPath);
            if (nestedDeps.size() > 1) {
                deps.addAll(0, nestedDeps.subList(1, nestedDeps.size()));
            }
        }
        return deps;
    }
    
    /**
     * Given a module, i.e. "by8.Element", return a path, i.e., "js/Element.js"
     * or "css/Element.css".  The implementor should return the correct prefix/
     * suffix.
     * @param module
     * @return
     */
    protected abstract String getPathFromModule(String module);

    private String removeRequireCalls(String source) {
        return source.replaceAll("\\bby8\\.require\\(", "by8.required(")
                .replaceAll("\\bby8\\.include\\(", "by8.required(");
    }
}
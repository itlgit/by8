package com.byeight.js.parser;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class By8Parser {
    private Pattern requiresPattern = Pattern.compile("by8\\.require\\(['\"]([\\w\\.]+)['\"]");
    private File parentDir;
    
    public By8Parser(File parentDir) {
        this.parentDir = parentDir;
    }
    
    /**
     * Given a script source file path, get its contents and that of all of its
     * dependents.
     * @param sourcePath The relative or absolute filesystem path to the file
     * @return
     * @throws IOException 
     */
    public String getContents(String sourcePath) throws IOException {
        StringBuffer buff = new StringBuffer(
                "/*! "+sourcePath+" */\n"+
                readFile(sourcePath)
        );
        List<String> deps = getDependencies(buff.toString());
        for (String dep : deps) {
            String path = getPathFromModule(dep);
            buff.append(
                    "\n/*! "+dep+" */\n"+
                    readFile(path)
            );
        }
        return removeRequireCalls(buff.toString());
    }
    
    /**
     * Return the timestamp of the last file to be modified within the entire
     * chain of dependencies.
     * @param sourcePath
     * @return
     * @throws IOException 
     */
    public long getLatestTimestamp(String sourcePath) throws IOException {
        // TODO: is this needed?  why not use the timestamp of app startup?
//        String contents = getContents(sourcePath);
//        List<String> deps = getDependencies(contents);
//        long latest = new File(webContentLoader.getResource(sourcePath)).lastModified();
        
        return 0L;
    }
    
    public StringBuffer readFile(String resource) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(
                new FileInputStream(new File(parentDir, resource))));
        StringBuffer buff = new StringBuffer();
        String line;
        while ((line = br.readLine()) != null) {
            buff.append(line+"\n");
        }
        br.close();
        return buff;
    }
    
    /**
     * Parse a script source and look for by8.require() calls.
     * @param source JavaScript source content
     * @return
     */
    public List<String> getDependencies(String source) {
        ArrayList<String> deps = new ArrayList<String>();
        Matcher m = requiresPattern.matcher(source);
        while (m.find()) {
            deps.add(m.group(1));
        }
        return deps;
    }
    
    public String removeRequireCalls(String source) {
        return source.replaceAll("\\bby8\\.require\\(", "by8.include(");
    }
    
    public String getPathFromModule(String module) {
        String path = module.replaceAll("^by8\\.", "").replaceAll("\\.", "/")+".js";
        return "js/"+path;
    }
}

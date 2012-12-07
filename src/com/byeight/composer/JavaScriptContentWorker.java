package com.byeight.composer;

import java.io.File;

import com.byeight.composer.compress.JSCompressor;

public class JavaScriptContentWorker extends AbstractWebContentWorker {

    public JavaScriptContentWorker(File parentDir) {
        super(parentDir, new JSCompressor());
    }

    @Override
    public String getContentType() {
        return "text/javascript";
    }
    
    @Override
    protected String getPathFromModule(String module) {
        String path = module.replaceAll("^by8\\.", "").replaceAll("\\.", "/")+".js";
        return "js/"+path;
    }

}

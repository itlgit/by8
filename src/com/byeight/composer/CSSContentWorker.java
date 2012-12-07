package com.byeight.composer;

import java.io.File;

import com.byeight.composer.compress.CSSCompressor;

public class CSSContentWorker extends AbstractWebContentWorker {

    public CSSContentWorker(File parentDir) {
        super(parentDir, new CSSCompressor());
    }

    @Override
    public String getContentType() {
        return "text/css";
    }
    
    @Override
    protected String getPathFromModule(String module) {
        String path = module.replaceAll("^by8\\.", "").replaceAll("\\.", "/")+".css";
        return "css/"+path;
    }
}

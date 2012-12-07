package com.byeight.composer;

import java.io.IOException;

public interface ContentWorker {
    public String getContentType();
    public String getContents(String sourcePath) throws IOException;
    /**
     * Returns the last modified time of all files in the resource.
     * @param sourcePath
     * @return
     * @throws IOException
     */
    public long lastModified(String sourcePath) throws IOException;
}

package com.byeight.composer;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;

import org.junit.Before;
import org.junit.Test;

public class JavaScriptContentWorkerTest {
    private final String pathName = "js/by8-core.js";
    private AbstractWebContentWorker worker;

    @Before
    public void setUp() {
        worker = new JavaScriptContentWorker(new File("web"));
    }
    
    @Test
    public void testGetContentType() {
        assertEquals("text/javascript", worker.getContentType());
    }

    @Test
    public void testGetContents() throws IOException {
        assertNotNull(worker.getContents(pathName));
    }

    @Test
    public void testLastModified() throws IOException {
        assertTrue("Expected new content", worker.lastModified(pathName) > 0);
        assertFalse("Didn't expect new content", worker.lastModified(pathName) > 0);
    }

}

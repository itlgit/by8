package com.byeight.tags;

import java.io.IOException;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class IndexerTest {

    private Indexer indexer;

    @Before
    public void setup() {
        if (indexer == null) {
            try {
                indexer = Indexer.instance("./src/test/resources/thumbs/Media");
                while (!indexer.isReady()) {
                    Thread.sleep(500);
                    Thread.yield();
                }
            } catch (IOException e) {
                Assert.fail(e.getMessage());
            }
            catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Test
    public void testQuery() {
        List<Tag> tags = indexer.query("dance");
        Assert.assertEquals(33, tags.size());
        indexer.stop();
    }

}

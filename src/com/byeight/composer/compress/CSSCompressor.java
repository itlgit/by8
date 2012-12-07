package com.byeight.composer.compress;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.StringReader;

import com.yahoo.platform.yui.compressor.CssCompressor;

public class CSSCompressor implements Compressor {

    public CSSCompressor() {
    }

    @Override
    public byte[] compress(String content) {
        return compress(content, "utf-8");
    }

    @Override
    public byte[] compress(String content, String charset) {
        Reader in = new StringReader(content);
        try {
            CssCompressor compressor = new CssCompressor(in);
            ByteArrayOutputStream baos = new ByteArrayOutputStream(content.length()/2);
            OutputStreamWriter out = new OutputStreamWriter(baos, charset);
            int linebreakpos = 0;
            compressor.compress(out, linebreakpos);
            out.close();
            
            return baos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

}

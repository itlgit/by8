package com.byeight.composer.compress;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.StringReader;

import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;

import com.yahoo.platform.yui.compressor.JavaScriptCompressor;


public class JSCompressor implements Compressor {

    @Override
    public byte[] compress(String content) {
        return compress(content, "utf-8");
    }

    @Override
    public byte[] compress(String content, String charset) {
        Reader in = new StringReader(content);
        try {
            JavaScriptCompressor compressor = new JavaScriptCompressor(in, new ErrorReporter() {

                public void warning(String message, String sourceName,
                        int line, String lineSource, int lineOffset) {
                    if (line < 0) {
                        System.err.println("\n[WARNING] " + lineSource + " "+ message);
                    } else {
                        System.err.println("\n[WARNING] " + lineSource + " " + line + ':' + lineOffset + ':' + message);
                    }
                }

                public void error(String message, String sourceName,
                        int line, String lineSource, int lineOffset) {
                    if (line < 0) {
                        System.err.println("\n[ERROR] " + lineSource + " " + message);
                    } else {
                        System.err.println("\n[ERROR] " + lineSource + " " + line + ':' + lineOffset + ':' + message);
                    }
                }

                public EvaluatorException runtimeError(String message, String sourceName,
                        int line, String lineSource, int lineOffset) {
                    error(message, sourceName, line, lineSource, lineOffset);
                    return new EvaluatorException(message);
                }
            });
            ByteArrayOutputStream baos = new ByteArrayOutputStream(content.length()/2);
            OutputStreamWriter out = new OutputStreamWriter(baos, charset);
            boolean munge = true,
                    preserveAllSemiColons = false,
                    disableOptimizations = false,
                    verbose = false;
            int linebreakpos = 80;
            compressor.compress(out, linebreakpos, munge, verbose,
                    preserveAllSemiColons, disableOptimizations);
            out.close();
            return baos.toByteArray();
        } catch (EvaluatorException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

}

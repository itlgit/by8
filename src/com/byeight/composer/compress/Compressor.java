package com.byeight.composer.compress;

public interface Compressor {
    public byte[] compress(String content);
    public byte[] compress(String content, String charset);
}

package com.byeight.manifest.bo;

import java.util.regex.Pattern;

public class Image {
    public static final String IMAGE_TYPE = "image";
    public static final String VIDEO_TYPE = "video";

    private static final Pattern TYPE_TEST = Pattern.compile(".*\\.mp4$", Pattern.CASE_INSENSITIVE);

    private String url;
    private String thumb;
    private int width;
    private int height;

    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getThumb() {
        return thumb;
    }
    public void setThumb(String thumb) {
        this.thumb = thumb;
    }
    public int getWidth() {
        return width;
    }
    public void setWidth(int width) {
        this.width = width;
    }
    public int getHeight() {
        return height;
    }
    public void setHeight(int height) {
        this.height = height;
    }

    /**
     * Infer the type from the {@link #url}
     * @return
     */
    public String getType() {
        String type = IMAGE_TYPE;
        String url = getUrl();
        if (TYPE_TEST.matcher(url).matches()) {
            type = VIDEO_TYPE;
        }
        return type;
    }
}

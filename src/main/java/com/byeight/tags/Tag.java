package com.byeight.tags;

public class Tag {

    private String path;
    private String type;
    private String value;

    public Tag(String path, String type, String value) {
        super();
        this.path = path;
        this.type = type;
        this.value = value;
    }
    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getValue() {
        return value;
    }
    public void setValue(String value) {
        this.value = value;
    }


}

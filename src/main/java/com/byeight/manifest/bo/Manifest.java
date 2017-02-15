package com.byeight.manifest.bo;

import java.util.ArrayList;
import java.util.List;

public class Manifest {
    private String uri;
    private List<String> directories;
    private List<Item> items;

    public Manifest() {

    }

    public Manifest(String uri, List<String> directories, List<Item> items) {
        super();
        this.uri = uri;
        this.directories = directories;
        this.items = items;
    }
    public String getUri() {
        return uri;
    }
    public void setUri(String uri) {
        this.uri = uri;
    }
    public List<String> getDirectories() {
        if (directories == null) {
            directories = new ArrayList<>();
        }
        return directories;
    }
    public List<Item> getItems() {
        if (items == null) {
            items = new ArrayList<>();
        }
        return items;
    }
}

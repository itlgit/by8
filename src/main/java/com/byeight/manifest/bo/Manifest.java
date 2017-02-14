package com.byeight.manifest.bo;

import java.util.ArrayList;
import java.util.List;

public class Manifest {
    private List<String> directories;
    private List<Item> items;

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

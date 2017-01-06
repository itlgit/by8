package com.byeight.manifest.bo;

import java.util.ArrayList;
import java.util.List;

public class Manifest {
    private List<String> directories;
    private List<Image> images;

    public List<String> getDirectories() {
        if (directories == null) {
            directories = new ArrayList<>();
        }
        return directories;
    }
    public List<Image> getImages() {
        if (images == null) {
            images = new ArrayList<>();
        }
        return images;
    }
}

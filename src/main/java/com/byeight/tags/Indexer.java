package com.byeight.tags;

public class Indexer {
    private static Indexer instance;

    public static Indexer instance() {
        if (instance == null) {
            instance = new Indexer();
        }
        return instance;
    }

    private Indexer() {
        /*
         * Insert Collectors
         */
    }

    public static void main(String[] args) {

    }

}

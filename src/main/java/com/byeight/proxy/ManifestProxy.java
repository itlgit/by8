package com.byeight.proxy;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import com.byeight.manifest.bo.Item;
import com.byeight.manifest.bo.Manifest;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class ManifestProxy {

    /**
     * Get the Manifest element from the URI
     * @param origPath
     * @return Manifest
     */
    public static Manifest get(String requestURI) {
        Manifest manifest = new Manifest();
        try {
            String json = getManifestContent(requestURI);
            JsonParser parser = new JsonParser();
            JsonObject object = parser.parse(json).getAsJsonObject();
            JsonArray dirs = object.getAsJsonArray("directories");
            JsonArray imgs = object.getAsJsonArray("images");

            for (int i=0,len=dirs.size(); i<len; i++) {
                String dir = dirs.get(i).getAsString();
                manifest.getDirectories().add(dir);
            }
            for (int i=0,len=imgs.size(); i<len; i++) {
                JsonObject jsonImg = imgs.get(i).getAsJsonObject();
                Item img = new Item();
                img.setUrl(jsonImg.get("lg").getAsString());
                img.setThumb(jsonImg.get("tn").getAsString());
                img.setWidth(jsonImg.get("w").getAsInt());
                img.setHeight(jsonImg.get("h").getAsInt());
                manifest.getItems().add(img);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return manifest;
    }

    private static String getManifestContent(String origPath) throws IOException {
        String prefix = Configuration.getAeonPrefix();
        URL destURL = new URL(prefix + "thumbs/" + origPath + "manifest.json");
        HttpURLConnection conn = (HttpURLConnection) destURL.openConnection();

        conn.connect();
        BufferedReader br = new BufferedReader(new InputStreamReader(
                conn.getInputStream()));
        StringBuffer buff = new StringBuffer();
        String line;
        while ((line = br.readLine()) != null) {
            buff.append(line + "\n");
        }
        br.close();

        return buff.toString();
    }

}

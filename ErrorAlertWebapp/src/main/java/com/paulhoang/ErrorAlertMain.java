package com.paulhoang;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Collection;

import static spark.Spark.*;
/**
 * Created by paul on 20/10/14.
 * Basic
 */
public class ErrorAlertMain {

    public static void main(final String[] args)
    {
        setPort(9090);
        setIpAddress("127.0.0.1");
        post("/derp", (req, res) -> {
            res.header("Access-Control-Allow-Origin", "http://localhost:63342");
            final Gson gson = new Gson();
            ArrayList<Tile> tiles = new ArrayList<>();
            tiles = gson.fromJson(req.body(), tiles.getClass());
            //persist the tiles or do somthing with it
            return "response!";
        });

        //CORS pre flight request checks to see if an ajax request is allowed
        options("/derp", (req, res) -> {
            res.header("Access-Control-Allow-Origin", "http://localhost:63342");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            return 200;
        });
    }
}

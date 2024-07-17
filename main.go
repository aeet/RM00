package main

import (
	"entgo.io/ent/entc"
	"entgo.io/ent/entc/gen"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

func main() {
	// generate domain
	err := entc.Generate("./domain/schema", &gen.Config{
		Schema:  "./domain/schema",
		Target:  "./domain",
		Package: "github.com/hbyunzai/ycloud/domain",
		Header:  `// Code generated by entc. DO NOT EDIT.`,
	})
	if err != nil {
		log.Fatal("running ent codegen error:", err)
	}

	// create table
	err = TableInitialization()
	if err != nil {
		log.Fatal("table initialization error:", err)
	}

	// create web server
	app := echo.New()
	app.Use(middleware.StaticWithConfig(middleware.StaticConfig{Root: "./ui/.output/public", Browse: false, HTML5: true}))
	app.GET("/ui/*", func(c echo.Context) error { return c.File("./ui/.output/public/index.html") })
	app.Logger.Fatal(app.Start("127.0.0.1:8080"))
}

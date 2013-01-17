Datagrid - PHP and JS datagrid library
========

Work under way

## Basic example

Javascript version:

```javascript
var example1 = new Datagrid("datagrid-example");

example1.addColumns([
	new Column("title", "Title"),
	new Column("description", "Description")
]);

example1.addRows([
	{
		"title":       "Test",
		"description": "This is a long description."
	},
	{
		"title":       "Another test",
		"description": "This is another long description."
	}
]);

example1.render(".datagrid-example");
```

PHP version:

```php
$example1 = new Datagrid();

$example1->addColumns([
	new Column("title", "Title"),
	new Column("description", "Description"),
]);

$example1->addRows([
	[
		"title" => "Test",
		"description" => "This is a long description.",
	],
	[
		"title" => "Another test",
		"description" => "This is another long description.",
	],
]);

$datagridRenderer = new DatagridRenderer();
$datagridRenderer->render($example1);
```

## Example with entities

### Static list

```php
$articlesDatagrid = new EntityDatagrid("articlesDatagrid");

$articlesDatagrid->addColumns([
	new TextColumn("title", "Title"),                 // will map to $article->getTitle()
	new LongTextColumn("description", "Description"), // will map to $article->getDescription()
	new TextColumn("author.name", "Author"),          // will map to $article->getAuthor()->getName()
]);

$articlesDatagrid->setEntities($articles);

$datagridRenderer = new DatagridRenderer();
$datagridRenderer->render($articlesDatagrid);
```


### Dynamic list

```php
$articlesDatagrid = new EntityDatagrid("articlesDatagrid");

$articlesDatagrid->addColumns([
	new TextColumn("title", "Title"),                 // will map to $article->getTitle()
	new LongTextColumn("description", "Description"), // will map to $article->getDescription()
	new TextColumn("author.name", "Author"),          // will map to $article->getAuthor()->getName()
]);

$articlesDatagrid->setQuery("select article from MyProject\Model\Article article");

$datagridRenderer = new DatagridRenderer();
$datagridRenderer->render($articlesDatagrid);
```

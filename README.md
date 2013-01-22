Datagrid - PHP and JS datagrid library
========

Work under way

## Features

- JS datagrid
- Datagrid generation with PHP
- PHP entities/objects datagrid (e.g. Doctrine entities)
- AJAX: async content loading

## Basic example

Javascript version:

```javascript
var example1 = new Datagrid();

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

```php
$articlesDatagrid = new EntityDatagrid("articles");

$articlesDatagrid->addColumns([
	new TextColumn("title", "Title"),                      // will map to $article->getTitle()
	new LongTextColumn("description", "Description"),      // will map to $article->getDescription()
	new TextColumn("authorName", "Author", "author.name"), // will map to $article->getAuthor()->getName()
]);

$articlesDatagrid->setEntities($articles);

$datagridRenderer = new DatagridRenderer();
$datagridRenderer->render($articlesDatagrid);
```

## Configuration

### PHP

See the examples above.

### YAML

```yaml
# views/datagrids/articles.yml
articles:
  type: EntityDatagrid
  columns:
    title:
      type: text
      label: Article title
    description:
      type: longtext
      label: Description
    authorName:
      type: text
      label: Author
      path: author.name
```

```php
$articlesDatagrid = Datagrid::build("articles");
$articlesDatagrid->setEntities($articles);

$datagridRenderer = new DatagridRenderer();
$datagridRenderer->render($articlesDatagrid);
```

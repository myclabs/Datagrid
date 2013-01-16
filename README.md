Datagrid
========

PHP and JS datagrid library

Work under way

### Example

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
	},
	{
		"description": "The description is defined before the title.",
		"title":       "A third test"
	}
]);

example1.render(".datagrid-example");
```

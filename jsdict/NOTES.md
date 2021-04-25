## Entries (`<entry></entry>`) are generic JSON objects that populate the dictionary array.
```xml
<entry>
<ent_seq>1000000</ent_seq>
<r_ele>
<reb>ヽ</reb>
</r_ele>
<r_ele>
<reb>くりかえし</reb>
</r_ele>
<sense>
<pos>&n;</pos>
<gloss>repetition mark in katakana</gloss>
</sense>
</entry>
```

becomes...

```json
  {
   "ent_seq": "1000000",
   "r_ele": [
    {
     "reb": "ヽ"
    },
    {
     "reb": "くりかえし"
    }
   ],
   "sense": {
    "pos": "&n;",
    "gloss": "repetition mark in katakana"
   }
  }
```

## Dictionary array is kept in "dictionary" field of root JSON file.
```json
{
 "dictionary": [
  [...]
 ]
}
```

## Children tags are converted into named members in the entry object.
```xml
<entry>
<ent_seq>1000000</ent_seq>
```

becomes...

```json
{
 "ent_seq": "1000000",
```

## If children tags contain children tags, the value is converted to an object with its own children tags (just like entry objects).
```xml
<entry>
[...]
<sense>
<pos>&n;</pos>
<gloss>repetition mark in katakana</gloss>
</sense>
```
becomes...

```json
{
 [...]
   "sense": {
    "pos": "&n;",
    "gloss": "repetition mark in katakana"
   }
```

## If duplicate children tags are present, the object's member is converted to an array.
```xml
<entry>
[...]
<r_ele>
<reb>ヽ</reb>
</r_ele>
<r_ele>
<reb>くりかえし</reb>
</r_ele>
[...]
</entry>
```

becomes...

```json
{
 [...]
 "r_ele": [
  {
   "reb": "ヽ"
  },
  {
   "reb": "くりかえし"
  }
 ],
 [...]
}
```

## Self-closing tags are added as an empty member (which is represented as a blank string).
```xml
<r_ele>
<reb>あかん</reb>
</r_ele>
<r_ele>
<reb>アカン</reb>
<re_nokanji/>
</r_ele>
```

becomes

```json
   "r_ele": [
    {
     "reb": "あかん"
    },
    {
     "reb": "アカン",
     "re_nokanji": ""
    }
   ],
```

## Tags with attributes are weird.
Because there's really no 1:1 way to represent a tag with attributes and a body in JSON, I've opted to represent all tags with attributes as full blown JSON objects no matter what the body of the tag is. Each attribute will be a member of the object. If there is any body to the tag, it will be added to the object as its "body" member. If the body contains further children tags, it will be fully parsed (though this is irrelevant to this project).

```xml
<lsource xml:lang="por">espada</lsource>
```

becomes...

```json
     "lsource": {
      "lang": "por",
      "body": "espada"
     },
```

## Entities have been left in tact.
In JMdict, entities are used to allow compact descriptions of words while also allowing quick lookup if necessary. I've included a copy of the entity table in `entities.txt`. I've opted to leave the entities in their original form for the sake of recognizing entities.

```xml
<sense>
<pos>&n;</pos>
<gloss>food</gloss>
</sense>
```

becomes...

```json
   "sense": {
    "pos": "&n;",
    "gloss": "food"
   }
```


## `<lsource>`'s `xml:lang` attribute renamed to `lang`.
Seems kind of redundant to keep the `xml:` bit.
# Search

The search configuration allows you to define search entries that will be indexed and displayed in the HCC UI search.

## Search entry spec

An example of a search entry:

```yaml
objects:
  - spec:
      searchEntries:
        - id: "search-entry-id"
          title: "Search Entry Title"
          description: "Detailed description of the search entry"
          href: "/path/to/resource"
          alt_title: ["Synonym1", "Synonym2"]
          isExternal: false
          permissions: []
```

### **`id`**
*string*

Unique ID of the search entry within the Frontend resource.


### **`title`**
*string*

A title of the search entry


### **`description`**
*string*

Detailed description of the search result. Should describe the location towards the search entry leads.


### **`href`**
*string*

Equivalent to the `href` attribute for the `a` HTML element.


### **`alt_title`**
*array\<string\>*
*(optional)*

A list of synonyms that could describe the features. For example, an entry with title of `Red Hat Enterprise Linux` can have `RHEL` as one of the alt_title items.


#### **`isExternal`**
*bool*
*(optional)*

The link leads to a different domain. Clicking the link will open a new browser tab.

#### **`permissions`**
*array*
*(optional)*

Rules to conditionally show/hide the search entry. The permissions function are listed in [Chrome UI docs](https://github.com/RedHatInsights/insights-chrome/blob/master/docs/navigation.md#permissions)

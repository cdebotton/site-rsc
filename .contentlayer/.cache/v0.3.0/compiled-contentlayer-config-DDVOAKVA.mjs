// contentlayer.config.ts
import { makeSource, defineDocumentType } from "contentlayer/source-files";
var BlogPost = defineDocumentType(() => {
  return {
    name: "BlogPost",
    filePathPattern: "blog/**/*.md",
    contentType: "mdx",
    description: "It's a post",
    fields: {
      title: {
        type: "string",
        required: true
      },
      date: {
        type: "date",
        required: true
      },
      description: {
        type: "string",
        required: true
      }
    },
    computedFields: {
      slug: {
        type: "string",
        resolve: (doc) => doc._raw.flattenedPath
      }
    }
  };
});
var contentlayer_config_default = makeSource({
  documentTypes: [BlogPost],
  contentDirPath: "./content"
});
export {
  BlogPost,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-DDVOAKVA.mjs.map

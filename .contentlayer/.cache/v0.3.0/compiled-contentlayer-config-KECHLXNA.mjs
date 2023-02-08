// contentlayer.config.ts
import { makeSource, defineDocumentType } from "contentlayer/source-files";
var BlogPost = defineDocumentType(() => {
  return {
    name: "blogPost",
    filePathPattern: "blog/**/*.md",
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
    }
  };
});
var contentlayer_config_default = makeSource({
  documentTypes: [BlogPost],
  contentDirPath: "./src/content"
});
export {
  BlogPost,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-KECHLXNA.mjs.map

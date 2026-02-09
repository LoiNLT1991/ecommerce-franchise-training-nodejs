module.exports = function (plop) {
  plop.setGenerator("module", {
    description: "Create a new module",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Module name (PascalCase, ex: UserFranchiseRole):",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.module.ts",
        templateFile: "plop-templates/module.hbs",
      },
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.controller.ts",
        templateFile: "plop-templates/controller.hbs",
      },
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.service.ts",
        templateFile: "plop-templates/service.hbs",
      },
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.repository.ts",
        templateFile: "plop-templates/repository.hbs",
      },
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.enum.ts",
        template: "",
      },
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.interface.ts",
        template: "",
      },
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.mapper.ts",
        template: "",
      },
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.model.ts",
        template: "",
      },
      {
        type: "add",
        path: "src/modules/{{kebabCase name}}/{{kebabCase name}}.route.ts",
        templateFile: "plop-templates/route.hbs",
      },
      {
        type: "addMany",
        destination: "src/modules/{{kebabCase name}}/dto",
        base: "plop-templates/dto",
        templateFiles: "plop-templates/dto/*.hbs",
      },
    ],
  });
};

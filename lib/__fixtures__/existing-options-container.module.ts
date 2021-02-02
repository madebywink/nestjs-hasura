import { Module } from "@nestjs/common";

const provider = {
  provide: "existing_options",
  useValue: {
    hostname: "localhost",
    adminSecret: "adminsecret",
    port: 8080,
    scheme: "http",
  },
};

@Module({
  providers: [provider],
  exports: [provider],
})
export class ExistingOptionsContainer {}

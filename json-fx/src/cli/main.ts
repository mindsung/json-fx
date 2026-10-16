import { runCli } from "./cli";

process.exitCode = runCli(process.argv.slice(2), {
  out: (text) => { process.stdout.write(text); },
  err: (text) => { process.stderr.write(text); }
});

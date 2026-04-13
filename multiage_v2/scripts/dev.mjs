import { spawn } from "node:child_process";

const children = [];
let shuttingDown = false;
const npmExecPath = process.env.npm_execpath;

function run(label, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    for (const current of children) {
      if (current !== child && !current.killed) {
        current.kill();
      }
    }

    process.exit(code ?? 0);
  });

  child.on("error", (error) => {
    console.error(`[${label}] ${error.message}`);
    if (!shuttingDown) {
      shuttingDown = true;
      process.exit(1);
    }
  });

  children.push(child);
}

if (!npmExecPath) {
  throw new Error("npm_execpath is not available in this session.");
}

run("server", process.execPath, [npmExecPath, "run", "server"]);
run("client", process.execPath, [npmExecPath, "run", "client"]);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    for (const child of children) {
      if (!child.killed) {
        child.kill();
      }
    }

    process.exit(0);
  });
}

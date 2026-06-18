{ pkgs, ... }:
{
  name = "storm-software/action-dependabot-approve";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;

  packages = with pkgs; [
    zizmor
  ];
}

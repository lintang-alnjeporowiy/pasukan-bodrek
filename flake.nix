{
  description = "Maritime Transportation and Port Planning Application Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            python312
            python312Packages.pip
            python312Packages.virtualenv
            nodejs
            postgresql
            highs
            git
            playwright
            chromium
            nss
            nspr
            atk
            at-spi2-atk
            gtk3
            pango
            cairo
            libdrm
            mesa
            xorg.libX11
            xorg.libXcomposite
            xorg.libXdamage
            xorg.libXext
            xorg.libXfixes
            xorg.libXrandr
            xorg.libxcb
            xorg.libXi
            alsa-lib
          ];

          shellHook = ''
            echo "========================================================="
            echo "Maritime Transportation & Port Planning Dev Shell Active"
            echo "========================================================="
            echo "Tools available:"
            echo "  - Python: $(python --version)"
            echo "  - Node.js: $(node --version)"
            echo "  - NPM: $(npm --version)"
            echo "  - PostgreSQL Client: $(psql --version)"
            echo "  - HiGHS Solver: $(highs --version | head -n 1)"
            echo "  - Git: $(git --version)"
            echo "========================================================="
            echo "To initialize Python virtual environment:"
            echo "  1. cd backend"
            echo "  2. python -m venv .venv"
            echo "  3. source .venv/bin/activate"
            echo "  4. pip install --upgrade pip"
            echo "========================================================="
          '';
        };
      });
    };
}

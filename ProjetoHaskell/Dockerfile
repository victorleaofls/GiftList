FROM haskell:9.6.7 AS build

WORKDIR /app

RUN apt-get update && \
    apt-get install -y gnupg curl && \
    curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    echo "deb http://apt.postgresql.org/pub/repos/apt $(grep VERSION_CODENAME /etc/os-release | cut -d= -f2)-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
    apt-get update && \
    apt-get install -y postgresql-client-14 libpq-dev build-essential pkg-config && \
    rm -rf /var/lib/apt/lists/*

COPY projetoHello.cabal cabal.project LICENSE ./

RUN mkdir -p app/Api app/Server && \
    touch app/Main.hs app/Api/Model.hs app/Server/Routes.hs CHANGELOG.md

RUN --mount=type=cache,target=/root/.cabal \
    --mount=type=cache,target=/root/.ghc \
    cabal v2-update && \
    cabal v2-build --only-dependencies

COPY . .

RUN --mount=type=cache,target=/root/.cabal \
    --mount=type=cache,target=/root/.ghc \
    cabal v2-build exe:projetoHello

FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y libgmp10 libpq5 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/dist-newstyle/build/*/*/projetoHello-*/x/projetoHello/build/projetoHello/projetoHello .

EXPOSE 8080

CMD ["/app/projetoHello"]
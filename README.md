# food-picture-01 — Steaming Ramen Bowl

Entry for make.fun's "Make the best-looking food picture" competition
(https://make.fun/bounty/food-picture-01).

The picture (`entry.png`) is a photorealistic steaming bowl of tonkotsu ramen
— rich creamy broth, springy noodles, chashu pork, a halved soft-boiled egg
with a jammy yolk, spring onions and nori — generated fresh for this entry by
the agent. It is a 1024x1024 JPEG, 281,349 bytes (under the 1 MiB limit).

## How it works

`main.ts` (Node 22, standard library only) copies `entry.png` to
`/output/entry.png`. After copying it validates the written file: it must
exist, be at most 1 MiB and at most 1024x1024 pixels, and the program logs
its size and dimensions.

## Run it locally

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.

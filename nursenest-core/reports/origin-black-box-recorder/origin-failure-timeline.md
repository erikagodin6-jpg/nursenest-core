# Origin Failure Timeline

Generated: 2026-06-01T07:42:19.578Z

## Summary

- First event: 2026-06-01T07:37:45.296Z
- Last event: 2026-06-01T07:41:49.222Z
- Samples/events: 86
- Max RSS: 382 MB
- Max heap used: 255 MB
- Max event-loop lag: 7416 ms
- Max active requests: 1
- Shutdown events: 46
- Readiness events: 8

## Timeline

| Time | Component | Event | RSS | Heap | CPU % | Lag Max | Active Req | Ready | Watchdog | Child | Source |
|---|---|---|---:|---:|---:|---:|---:|---|---|---|---|
| 2026-06-01T07:37:45.296Z | parent-bootstrap | startup | 46 | 5 | 12.38 | 0 | 0 | not_ready | probing | not_spawned | 2026-06-01T07-37-45-294Z_parent-bootstrap_pid-1544711.jsonl |
| 2026-06-01T07:37:45.354Z | child-next-runtime | startup | 44 | 5 | 15.71 | 0 | 0 | child_runtime_booting | preload_not_loaded | running | 2026-06-01T07-37-45-352Z_child-next-runtime_pid-1544739.jsonl |
| 2026-06-01T07:37:45.367Z | child-next-runtime | child_preload_installed | 46 | 4 | 12.37 | 0 | 0 | child_runtime_booting | preload_installed | running | 2026-06-01T07-37-45-352Z_child-next-runtime_pid-1544739.jsonl |
| 2026-06-01T07:37:45.641Z | child-next-runtime | child_entry_loaded | 72 | 16 | 15.76 | 0 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-37-45-352Z_child-next-runtime_pid-1544739.jsonl |
| 2026-06-01T07:37:51.913Z | parent-bootstrap | handlers_ready_transition | 48 | 6 | 0.17 | 24 | 0 | ready | ready | running | 2026-06-01T07-37-45-294Z_parent-bootstrap_pid-1544711.jsonl |
| 2026-06-01T07:37:52.091Z | parent-bootstrap | signal | 47 | 6 | 1.23 | 22 | 0 | ready | ready | running | 2026-06-01T07-37-45-294Z_parent-bootstrap_pid-1544711.jsonl |
| 2026-06-01T07:37:52.092Z | parent-bootstrap | parent_signal | 48 | 6 | 14.81 | 0 | 0 | ready | ready | running | 2026-06-01T07-37-45-294Z_parent-bootstrap_pid-1544711.jsonl |
| 2026-06-01T07:37:52.093Z | child-next-runtime | signal | 382 | 254 | 14.4 | 6178 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-37-45-352Z_child-next-runtime_pid-1544739.jsonl |
| 2026-06-01T07:37:52.095Z | child-next-runtime | shutdown_signal | 382 | 254 | 8.68 | 0 | 0 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-37-45-352Z_child-next-runtime_pid-1544739.jsonl |
| 2026-06-01T07:37:52.097Z | child-next-runtime | exit | 382 | 254 | 13.92 | 0 | 0 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-37-45-352Z_child-next-runtime_pid-1544739.jsonl |
| 2026-06-01T07:37:52.141Z | parent-bootstrap | child_process_exit | 48 | 6 | 0.65 | 20 | 0 | ready | ready | exited | 2026-06-01T07-37-45-294Z_parent-bootstrap_pid-1544711.jsonl |
| 2026-06-01T07:37:52.142Z | parent-bootstrap | exit | 48 | 6 | 18.31 | 0 | 0 | ready | ready | exited | 2026-06-01T07-37-45-294Z_parent-bootstrap_pid-1544711.jsonl |
| 2026-06-01T07:37:52.226Z | parent-bootstrap | startup | 46 | 5 | 13.2 | 0 | 0 | not_ready | bypass | not_spawned | 2026-06-01T07-37-52-225Z_parent-bootstrap_pid-1544818.jsonl |
| 2026-06-01T07:37:52.285Z | child-next-runtime | startup | 44 | 5 | 14.27 | 0 | 0 | child_runtime_booting | preload_not_loaded | running | 2026-06-01T07-37-52-283Z_child-next-runtime_pid-1544829.jsonl |
| 2026-06-01T07:37:52.297Z | child-next-runtime | child_preload_installed | 46 | 4 | 13.57 | 0 | 0 | child_runtime_booting | preload_installed | running | 2026-06-01T07-37-52-283Z_child-next-runtime_pid-1544829.jsonl |
| 2026-06-01T07:37:52.562Z | child-next-runtime | child_entry_loaded | 71 | 16 | 15.16 | 0 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-37-52-283Z_child-next-runtime_pid-1544829.jsonl |
| 2026-06-01T07:37:52.832Z | parent-bootstrap | handlers_ready_transition | 47 | 5 | 0.66 | 21 | 0 | ready | ready | running | 2026-06-01T07-37-52-225Z_parent-bootstrap_pid-1544818.jsonl |
| 2026-06-01T07:37:58.945Z | parent-bootstrap | signal | 48 | 6 | 0.09 | 27 | 0 | ready | bypass | running | 2026-06-01T07-37-52-225Z_parent-bootstrap_pid-1544818.jsonl |
| 2026-06-01T07:37:58.946Z | parent-bootstrap | parent_signal | 48 | 6 | 17.46 | 0 | 0 | ready | bypass | running | 2026-06-01T07-37-52-225Z_parent-bootstrap_pid-1544818.jsonl |
| 2026-06-01T07:37:58.993Z | child-next-runtime | signal | 381 | 252 | 14.57 | 6203 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-37-52-283Z_child-next-runtime_pid-1544829.jsonl |
| 2026-06-01T07:37:58.995Z | child-next-runtime | shutdown_signal | 381 | 252 | 13.19 | 0 | 0 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-37-52-283Z_child-next-runtime_pid-1544829.jsonl |
| 2026-06-01T07:37:58.997Z | child-next-runtime | exit | 381 | 253 | 15.28 | 0 | 0 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-37-52-283Z_child-next-runtime_pid-1544829.jsonl |
| 2026-06-01T07:37:59.040Z | parent-bootstrap | child_process_exit | 48 | 6 | 0.61 | 20 | 0 | ready | bypass | exited | 2026-06-01T07-37-52-225Z_parent-bootstrap_pid-1544818.jsonl |
| 2026-06-01T07:37:59.041Z | parent-bootstrap | exit | 48 | 6 | 13.5 | 0 | 0 | ready | bypass | exited | 2026-06-01T07-37-52-225Z_parent-bootstrap_pid-1544818.jsonl |
| 2026-06-01T07:37:59.129Z | parent-bootstrap | startup | 46 | 5 | 8.93 | 0 | 0 | not_ready | probing | not_spawned | 2026-06-01T07-37-59-128Z_parent-bootstrap_pid-1544881.jsonl |
| 2026-06-01T07:37:59.162Z | parent-bootstrap | route_readiness_check | 47 | 5 | 5.71 | 20 | 1 | not_ready | not_ready | running | 2026-06-01T07-37-59-128Z_parent-bootstrap_pid-1544881.jsonl |
| 2026-06-01T07:37:59.189Z | child-next-runtime | startup | 44 | 5 | 16.78 | 0 | 0 | child_runtime_booting | preload_not_loaded | running | 2026-06-01T07-37-59-186Z_child-next-runtime_pid-1544894.jsonl |
| 2026-06-01T07:37:59.206Z | child-next-runtime | child_preload_installed | 45 | 4 | 12.82 | 0 | 0 | child_runtime_booting | preload_installed | running | 2026-06-01T07-37-59-186Z_child-next-runtime_pid-1544894.jsonl |
| 2026-06-01T07:37:59.212Z | child-next-runtime | child_entry_loaded | 46 | 5 | 12.58 | 0 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-37-59-186Z_child-next-runtime_pid-1544894.jsonl |
| 2026-06-01T07:38:04.611Z | parent-bootstrap | route_readiness_check | 48 | 6 | 0.15 | 21 | 1 | not_ready | not_ready | running | 2026-06-01T07-37-59-128Z_parent-bootstrap_pid-1544881.jsonl |
| 2026-06-01T07:38:04.616Z | parent-bootstrap | signal | 48 | 6 | 6.26 | 0 | 0 | not_ready | probing | running | 2026-06-01T07-37-59-128Z_parent-bootstrap_pid-1544881.jsonl |
| 2026-06-01T07:38:04.617Z | parent-bootstrap | parent_signal | 48 | 6 | 18.98 | 0 | 0 | not_ready | probing | running | 2026-06-01T07-37-59-128Z_parent-bootstrap_pid-1544881.jsonl |
| 2026-06-01T07:38:04.619Z | child-next-runtime | signal | 47 | 5 | 0.13 | 23 | 1 | child_entry_loaded | preload_installed | running | 2026-06-01T07-37-59-186Z_child-next-runtime_pid-1544894.jsonl |
| 2026-06-01T07:38:04.621Z | child-next-runtime | shutdown_signal | 47 | 5 | 12.74 | 0 | 1 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-37-59-186Z_child-next-runtime_pid-1544894.jsonl |
| 2026-06-01T07:38:04.633Z | parent-bootstrap | child_process_exit | 47 | 5 | 5.1 | 0 | 0 | not_ready | probing | exited | 2026-06-01T07-37-59-128Z_parent-bootstrap_pid-1544881.jsonl |
| 2026-06-01T07:38:04.634Z | parent-bootstrap | exit | 47 | 5 | 14.98 | 0 | 0 | not_ready | probing | exited | 2026-06-01T07-37-59-128Z_parent-bootstrap_pid-1544881.jsonl |
| 2026-06-01T07:38:04.781Z | parent-bootstrap | startup | 46 | 5 | 14.98 | 0 | 0 | not_ready | probing | not_spawned | 2026-06-01T07-38-04-779Z_parent-bootstrap_pid-1544928.jsonl |
| 2026-06-01T07:38:04.862Z | child-next-runtime | startup | 44 | 5 | 17.4 | 0 | 0 | child_runtime_booting | preload_not_loaded | running | 2026-06-01T07-38-04-859Z_child-next-runtime_pid-1544940.jsonl |
| 2026-06-01T07:38:04.879Z | child-next-runtime | child_preload_installed | 45 | 4 | 13.22 | 0 | 0 | child_runtime_booting | preload_installed | running | 2026-06-01T07-38-04-859Z_child-next-runtime_pid-1544940.jsonl |
| 2026-06-01T07:38:04.887Z | child-next-runtime | child_entry_loaded | 46 | 5 | 11.28 | 0 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-38-04-859Z_child-next-runtime_pid-1544940.jsonl |
| 2026-06-01T07:38:05.143Z | child-next-runtime | exit | 47 | 5 | 0.9 | 23 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-38-04-859Z_child-next-runtime_pid-1544940.jsonl |
| 2026-06-01T07:38:05.150Z | parent-bootstrap | child_process_exit | 47 | 5 | 1.05 | 23 | 0 | not_ready | probing | exited | 2026-06-01T07-38-04-779Z_parent-bootstrap_pid-1544928.jsonl |
| 2026-06-01T07:38:05.151Z | parent-bootstrap | exit | 47 | 5 | 18.78 | 0 | 0 | not_ready | probing | exited | 2026-06-01T07-38-04-779Z_parent-bootstrap_pid-1544928.jsonl |
| 2026-06-01T07:41:27.597Z | parent-bootstrap | startup | 45 | 5 | 11.46 | 0 | 0 | not_ready | probing | not_spawned | 2026-06-01T07-41-27-595Z_parent-bootstrap_pid-1546964.jsonl |
| 2026-06-01T07:41:27.657Z | child-next-runtime | startup | 44 | 5 | 15.35 | 0 | 0 | child_runtime_booting | preload_not_loaded | running | 2026-06-01T07-41-27-654Z_child-next-runtime_pid-1546975.jsonl |
| 2026-06-01T07:41:27.670Z | child-next-runtime | child_preload_installed | 45 | 4 | 12.96 | 0 | 0 | child_runtime_booting | preload_installed | running | 2026-06-01T07-41-27-654Z_child-next-runtime_pid-1546975.jsonl |
| 2026-06-01T07:41:27.964Z | child-next-runtime | child_entry_loaded | 71 | 16 | 15.67 | 0 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-41-27-654Z_child-next-runtime_pid-1546975.jsonl |
| 2026-06-01T07:41:35.476Z | parent-bootstrap | handlers_ready_transition | 46 | 5 | 0.17 | 24 | 0 | ready | ready | running | 2026-06-01T07-41-27-595Z_parent-bootstrap_pid-1546964.jsonl |
| 2026-06-01T07:41:35.643Z | parent-bootstrap | signal | 47 | 6 | 1.13 | 20 | 0 | ready | ready | running | 2026-06-01T07-41-27-595Z_parent-bootstrap_pid-1546964.jsonl |
| 2026-06-01T07:41:35.644Z | parent-bootstrap | parent_signal | 47 | 6 | 17.55 | 0 | 0 | ready | ready | running | 2026-06-01T07-41-27-595Z_parent-bootstrap_pid-1546964.jsonl |
| 2026-06-01T07:41:35.646Z | child-next-runtime | signal | 379 | 255 | 14.27 | 7416 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-41-27-654Z_child-next-runtime_pid-1546975.jsonl |
| 2026-06-01T07:41:35.647Z | child-next-runtime | shutdown_signal | 379 | 255 | 22.71 | 0 | 0 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-41-27-654Z_child-next-runtime_pid-1546975.jsonl |
| 2026-06-01T07:41:35.650Z | child-next-runtime | exit | 379 | 255 | 10.83 | 0 | 0 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-41-27-654Z_child-next-runtime_pid-1546975.jsonl |
| 2026-06-01T07:41:35.702Z | parent-bootstrap | child_process_exit | 47 | 6 | 0.63 | 22 | 0 | ready | ready | exited | 2026-06-01T07-41-27-595Z_parent-bootstrap_pid-1546964.jsonl |
| 2026-06-01T07:41:35.703Z | parent-bootstrap | exit | 47 | 6 | 13.68 | 0 | 0 | ready | ready | exited | 2026-06-01T07-41-27-595Z_parent-bootstrap_pid-1546964.jsonl |
| 2026-06-01T07:41:35.802Z | parent-bootstrap | startup | 46 | 5 | 12.86 | 0 | 0 | not_ready | bypass | not_spawned | 2026-06-01T07-41-35-800Z_parent-bootstrap_pid-1547292.jsonl |
| 2026-06-01T07:41:35.871Z | child-next-runtime | startup | 44 | 5 | 15.13 | 0 | 0 | child_runtime_booting | preload_not_loaded | running | 2026-06-01T07-41-35-869Z_child-next-runtime_pid-1547335.jsonl |
| 2026-06-01T07:41:35.885Z | child-next-runtime | child_preload_installed | 46 | 4 | 12.46 | 0 | 0 | child_runtime_booting | preload_installed | running | 2026-06-01T07-41-35-869Z_child-next-runtime_pid-1547335.jsonl |
| 2026-06-01T07:41:36.211Z | child-next-runtime | child_entry_loaded | 72 | 16 | 15.45 | 0 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-41-35-869Z_child-next-runtime_pid-1547335.jsonl |
| 2026-06-01T07:41:36.469Z | parent-bootstrap | handlers_ready_transition | 47 | 5 | 0.74 | 22 | 0 | ready | ready | running | 2026-06-01T07-41-35-800Z_parent-bootstrap_pid-1547292.jsonl |
| 2026-06-01T07:41:43.084Z | parent-bootstrap | signal | 48 | 6 | 0.09 | 22 | 0 | ready | bypass | running | 2026-06-01T07-41-35-800Z_parent-bootstrap_pid-1547292.jsonl |
| 2026-06-01T07:41:43.086Z | parent-bootstrap | parent_signal | 48 | 6 | 10.69 | 0 | 0 | ready | bypass | running | 2026-06-01T07-41-35-800Z_parent-bootstrap_pid-1547292.jsonl |
| 2026-06-01T07:41:43.125Z | child-next-runtime | signal | 380 | 255 | 14.44 | 6665 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-41-35-869Z_child-next-runtime_pid-1547335.jsonl |
| 2026-06-01T07:41:43.126Z | child-next-runtime | shutdown_signal | 380 | 255 | 19.93 | 0 | 0 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-41-35-869Z_child-next-runtime_pid-1547335.jsonl |
| 2026-06-01T07:41:43.128Z | child-next-runtime | exit | 380 | 255 | 13.63 | 0 | 0 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-41-35-869Z_child-next-runtime_pid-1547335.jsonl |
| 2026-06-01T07:41:43.188Z | parent-bootstrap | child_process_exit | 48 | 6 | 0.5 | 20 | 0 | ready | bypass | exited | 2026-06-01T07-41-35-800Z_parent-bootstrap_pid-1547292.jsonl |
| 2026-06-01T07:41:43.190Z | parent-bootstrap | exit | 48 | 6 | 8.18 | 0 | 0 | ready | bypass | exited | 2026-06-01T07-41-35-800Z_parent-bootstrap_pid-1547292.jsonl |
| 2026-06-01T07:41:43.291Z | parent-bootstrap | startup | 46 | 5 | 15.8 | 0 | 0 | not_ready | probing | not_spawned | 2026-06-01T07-41-43-289Z_parent-bootstrap_pid-1547403.jsonl |
| 2026-06-01T07:41:43.311Z | parent-bootstrap | route_readiness_check | 47 | 5 | 11.16 | 0 | 1 | not_ready | not_ready | running | 2026-06-01T07-41-43-289Z_parent-bootstrap_pid-1547403.jsonl |
| 2026-06-01T07:41:43.356Z | child-next-runtime | startup | 44 | 5 | 16.39 | 0 | 0 | child_runtime_booting | preload_not_loaded | running | 2026-06-01T07-41-43-354Z_child-next-runtime_pid-1547414.jsonl |
| 2026-06-01T07:41:43.370Z | child-next-runtime | child_preload_installed | 46 | 4 | 13.18 | 0 | 0 | child_runtime_booting | preload_installed | running | 2026-06-01T07-41-43-354Z_child-next-runtime_pid-1547414.jsonl |
| 2026-06-01T07:41:43.378Z | child-next-runtime | child_entry_loaded | 46 | 5 | 9.82 | 0 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-41-43-354Z_child-next-runtime_pid-1547414.jsonl |
| 2026-06-01T07:41:48.768Z | parent-bootstrap | route_readiness_check | 48 | 6 | 0.15 | 22 | 1 | not_ready | not_ready | running | 2026-06-01T07-41-43-289Z_parent-bootstrap_pid-1547403.jsonl |
| 2026-06-01T07:41:48.773Z | parent-bootstrap | signal | 47 | 5 | 11.46 | 0 | 0 | not_ready | probing | running | 2026-06-01T07-41-43-289Z_parent-bootstrap_pid-1547403.jsonl |
| 2026-06-01T07:41:48.774Z | parent-bootstrap | parent_signal | 47 | 5 | 14.16 | 0 | 0 | not_ready | probing | running | 2026-06-01T07-41-43-289Z_parent-bootstrap_pid-1547403.jsonl |
| 2026-06-01T07:41:48.775Z | child-next-runtime | signal | 47 | 5 | 0.12 | 22 | 1 | child_entry_loaded | preload_installed | running | 2026-06-01T07-41-43-354Z_child-next-runtime_pid-1547414.jsonl |
| 2026-06-01T07:41:48.777Z | child-next-runtime | shutdown_signal | 47 | 5 | 9.24 | 0 | 1 | child_entry_loaded | preload_installed | signal_received | 2026-06-01T07-41-43-354Z_child-next-runtime_pid-1547414.jsonl |
| 2026-06-01T07:41:48.782Z | parent-bootstrap | child_process_exit | 47 | 5 | 4.41 | 0 | 0 | not_ready | probing | exited | 2026-06-01T07-41-43-289Z_parent-bootstrap_pid-1547403.jsonl |
| 2026-06-01T07:41:48.783Z | parent-bootstrap | exit | 47 | 5 | 11.4 | 0 | 0 | not_ready | probing | exited | 2026-06-01T07-41-43-289Z_parent-bootstrap_pid-1547403.jsonl |
| 2026-06-01T07:41:48.871Z | parent-bootstrap | startup | 46 | 5 | 10.56 | 0 | 0 | not_ready | probing | not_spawned | 2026-06-01T07-41-48-869Z_parent-bootstrap_pid-1547438.jsonl |
| 2026-06-01T07:41:48.931Z | child-next-runtime | startup | 44 | 5 | 16.76 | 0 | 0 | child_runtime_booting | preload_not_loaded | running | 2026-06-01T07-41-48-928Z_child-next-runtime_pid-1547449.jsonl |
| 2026-06-01T07:41:48.950Z | child-next-runtime | child_preload_installed | 46 | 4 | 12.9 | 0 | 0 | child_runtime_booting | preload_installed | running | 2026-06-01T07-41-48-928Z_child-next-runtime_pid-1547449.jsonl |
| 2026-06-01T07:41:48.957Z | child-next-runtime | child_entry_loaded | 46 | 5 | 12.76 | 0 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-41-48-928Z_child-next-runtime_pid-1547449.jsonl |
| 2026-06-01T07:41:49.214Z | child-next-runtime | exit | 47 | 5 | 0.83 | 21 | 0 | child_entry_loaded | preload_installed | running | 2026-06-01T07-41-48-928Z_child-next-runtime_pid-1547449.jsonl |
| 2026-06-01T07:41:49.220Z | parent-bootstrap | child_process_exit | 47 | 5 | 0.75 | 21 | 0 | not_ready | probing | exited | 2026-06-01T07-41-48-869Z_parent-bootstrap_pid-1547438.jsonl |
| 2026-06-01T07:41:49.222Z | parent-bootstrap | exit | 47 | 5 | 10.15 | 0 | 0 | not_ready | probing | exited | 2026-06-01T07-41-48-869Z_parent-bootstrap_pid-1547438.jsonl |

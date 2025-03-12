<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\UpdateRankingJob;

class RunUpdateRanking extends Command
{
    protected $signature = 'job:update-ranking';
    protected $description = 'Ejecuta el Job UpdateRankingJob manualmente';

    public function handle()
    {
        dispatch(new UpdateRankingJob());
        $this->info('Job UpdateRankingJob ejecutado.');
    }
}

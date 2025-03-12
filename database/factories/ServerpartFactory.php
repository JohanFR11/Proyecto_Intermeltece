<?php

namespace Database\Factories;
use App\Models\Serverpart;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Serverpart>
 */
class ServerpartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $parts = ['CPU', 'RAM', 'SSD'];
        return [
            'description' => $this->faker->text(20),
            'product' => $this->faker->randomElement($parts),
            'usdPrice' => $this->faker->numerify('##')
        ];
    }
}

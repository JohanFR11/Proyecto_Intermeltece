<?php

namespace App\Http\Controllers\Functions;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UploadFilesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        if ($request->hasFile('filename')) {
            $file = $request->file('filename');
            $filename = $file->getClientOriginalName();
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $fileStrug = Str::slug($filename, '_') . '.' . $extension;
            $file->storeAs('documents/', $fileStrug);
            return $fileStrug;
        }
        return '';
    }
}

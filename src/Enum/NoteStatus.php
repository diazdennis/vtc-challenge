<?php

declare(strict_types=1);

namespace App\Enum;

enum NoteStatus: string
{
    case NEW = 'new';
    case TODO = 'todo';
    case DONE = 'done';

    public static function values(): array
    {
        return array_map(fn(self $status) => $status->value, self::cases());
    }
}

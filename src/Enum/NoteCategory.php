<?php

declare(strict_types=1);

namespace App\Enum;

enum NoteCategory: string
{
    case PERSONAL = 'personal';
    case WORK = 'work';
    case IDEAS = 'ideas';
    case ARCHIVE = 'archive';

    public static function values(): array
    {
        return array_map(fn(self $category) => $category->value, self::cases());
    }

    public function label(): string
    {
        return match($this) {
            self::PERSONAL => 'Personal',
            self::WORK => 'Work',
            self::IDEAS => 'Ideas',
            self::ARCHIVE => 'Archive',
        };
    }
}

import { MovieDBCast } from '@/infrastructure/interfaces/movie-db-credits.response';
import { MovieCredits } from '@/core/entities/movie-credits.entity';
import { IMAGE_BASE_URL } from '@/infrastructure/constants/images';

export class MovieCreditsMapper {
  static fromCreditsDBToEntity(credits: MovieDBCast): MovieCredits {
    return {
      character: credits.character,
      knownForDepartment: credits.known_for_department,
      name: credits.name,
      order: credits.order,
      originalName: credits.original_name,
      picture: credits.profile_path
        ? `${IMAGE_BASE_URL}${credits.profile_path}`
        : 'no-foto',
    };
  }
}

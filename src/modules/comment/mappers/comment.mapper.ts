import { PageMeta } from "../../../shared/pagination/page-meta";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";

export class CommentMapper {
    public getPaginatedListMapper(total: number, itemsPerPage: number, options: PageOptionsDto) {
        const pageOptionsDto = {
            ...options,
            page: +options.page,
            take: +options.take,
        } as PageOptionsDto;

        const meta = new PageMeta({
            itemsPerPage,
            total,
            pageOptionsDto,
        });

        return meta;
    }

    public getItemsWithLikesMapper(comments: any[], userId?: number) {
        return comments.map((comment) => {
            comment.is_liked = !!comment.likes.find((like) => like.userId == userId);
            comment.likes = comment.likes.length;
            return comment;
        });
    }
}

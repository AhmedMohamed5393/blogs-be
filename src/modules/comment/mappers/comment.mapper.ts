import { PageMeta } from "../../../shared/pagination/page-meta";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";

export class CommentMapper {
    public getPageMetaMapper(total: number, itemsPerPage: number, options: PageOptionsDto) {
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

    public getItemsWithLikesMapper(comments: any[]) {
        return comments.map((comment) => {
            comment.is_liked = !!comment.likes?.length ? comment.likes[0] : false;
            comment.likes = comment._count.likes;
            delete comment._count;
            return comment;
        });
    }
}

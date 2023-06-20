import { IPaginationOptions } from 'interfaces/pagination/pagination.interface'
import { PopulateOptions } from 'mongoose'

export interface IDatabaseFindOneOptions<T = any> extends Pick<IPaginationOptions, 'order'> {
    select?: Record<string, boolean | number>
    join?: boolean | PopulateOptions | PopulateOptions[]
    session?: T
    withDeleted?: boolean
}

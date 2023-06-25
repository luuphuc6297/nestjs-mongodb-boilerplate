import { Injectable } from '@nestjs/common'
import bytes from 'bytes'
import { ENUM_HELPER_FILE_TYPE } from 'constants/helper/helper.enum.constant'
import { readFileSync, writeFileSync } from 'fs'
import {
    IHelperFileCreateExcelWorkbookOptions,
    IHelperFileReadExcelOptions,
    IHelperFileRows,
    IHelperFileService,
    IHelperFileWriteExcelOptions,
} from 'interfaces'
import { WorkBook, read, utils, write } from 'xlsx'

@Injectable()
export class HelperFileService implements IHelperFileService {
    createExcelWorkbook(
        rows: IHelperFileRows[],
        options?: IHelperFileCreateExcelWorkbookOptions
    ): WorkBook {
        // headers
        const headers = Object.keys(rows[0])

        // worksheet
        const worksheet = utils.json_to_sheet(rows)

        // workbook
        const workbook = utils.book_new()

        utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' })
        utils.book_append_sheet(workbook, worksheet, options?.sheetName ?? 'Sheet 1')

        return workbook
    }

    writeExcelToBuffer(workbook: WorkBook, options?: IHelperFileWriteExcelOptions): Buffer {
        // create buffer
        const buff: Buffer = write(workbook, {
            type: 'buffer',
            bookType: options?.type ?? ENUM_HELPER_FILE_TYPE.CSV,
            password: options?.password,
        })

        return buff
    }

    readExcelFromBuffer(file: Buffer, options?: IHelperFileReadExcelOptions): IHelperFileRows[] {
        // workbook
        const workbook = read(file, {
            type: 'buffer',
            password: options?.password,
            sheets: options?.sheet,
        })

        // worksheet
        const worksheetName = workbook.SheetNames
        const worksheet = workbook.Sheets[worksheetName[0]]

        // rows
        const rows: IHelperFileRows[] = utils.sheet_to_json(worksheet)

        return rows
    }

    convertToBytes(megabytes: string): number {
        return bytes(megabytes)
    }

    createJson(path: string, data: Record<string, any>[]): boolean {
        const sData = JSON.stringify(data)
        writeFileSync(path, sData)

        return true
    }
    readJson(path: string): Record<string, any>[] {
        const data: string = readFileSync(path, 'utf8')
        return JSON.parse(data)
    }
}

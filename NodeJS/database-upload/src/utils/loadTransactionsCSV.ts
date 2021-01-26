import fs from 'fs';
import csvParse from 'csv-parse';

type ReturnType = Array<{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}>;

export default async function loadTransactionsCSV(
  filePath: string,
): Promise<ReturnType> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    fromLine: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const transactions: Array<{
    title: string;
    value: number;
    type: 'income' | 'outcome';
    category: string;
  }> = [];

  parseCSV.on('data', line => {
    const [title, type, value, category] = line;

    transactions.push({ title, type, value: Number(value), category });
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return transactions;
}

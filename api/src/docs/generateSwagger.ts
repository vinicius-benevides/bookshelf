import fs from 'fs';
import path from 'path';
import swaggerSpec from './swagger';

const outputPath = path.resolve(process.cwd(), 'src', 'docs', 'swagger.generated.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
// eslint-disable-next-line no-console
console.log(`Swagger spec gerado em ${outputPath}`);

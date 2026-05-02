import { Request, Response } from 'express';
import { query } from '../utils/db.js';

export async function getDocuments(req: Request, res: Response) {
  const dentistId = (req as any).user.id;
  const product = (req as any).user.product || 'academy';
  try {
    const result = await query(
      'SELECT * FROM documents WHERE dentist_id = $1 AND product = $2 ORDER BY created_at DESC',
      [dentistId, product]
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDocumentById(req: Request, res: Response) {
  const { id } = req.params;
  const dentistId = (req as any).user.id;
  const product = (req as any).user.product || 'academy';
  try {
    const result = await query(
      'SELECT * FROM documents WHERE id = $1 AND dentist_id = $2 AND product = $3',
      [id, dentistId, product]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createDocument(req: Request, res: Response) {
  const dentistId = (req as any).user.id;
  const product = (req as any).user.product || 'academy';
  const { patient_id, type, content } = req.body;
  try {
    const result = await query(
      'INSERT INTO documents (dentist_id, patient_id, product, type, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [dentistId, patient_id, product, type, JSON.stringify(content)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteDocument(req: Request, res: Response) {
  const { id } = req.params;
  const dentistId = (req as any).user.id;
  const product = (req as any).user.product || 'academy';
  try {
    await query(
      'DELETE FROM documents WHERE id = $1 AND dentist_id = $2 AND product = $3',
      [id, dentistId, product]
    );
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

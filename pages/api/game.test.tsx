import handler from './game';
import { NextApiRequest, NextApiResponse } from 'next'

describe('API handler', () => {
  let req: NextApiRequest, res: NextApiResponse;

  beforeEach(() => {
    // Mock NextApiRequest and NextApiResponse objects
    req = {} as NextApiRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as NextApiResponse;
  });

  it('should increment the game count and return the updated count', () => {
    handler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ game: 1 });

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ game: 2 });
  });
});

describe('API handler', () => {
  let req: NextApiRequest, res: NextApiResponse;

  beforeEach(() => {
    // Mock NextApiRequest and NextApiResponse objects
    req = {} as NextApiRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as NextApiResponse;
  });

  it('should return the correct response status and game count', () => {
    handler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ game: 3 });
  });
});
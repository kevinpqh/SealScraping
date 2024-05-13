import puppeteer from 'puppeteer';
import { PathUrl, LOGIN_PAGE_SEAL, MAIN_PAGE_SEAL, NameImage } from "./constants.js";
import { Utils } from './utils.js'

export class Seal {
  access = {};
  constructor(){
    this.access = {
      nroContrato: process.env.NROCONTRATO
    }
  }  

  async scraping() {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(PathUrl.SEAL);
  
    await page.setViewport({width: 1080, height: 1024});
  
    await page.locator(LOGIN_PAGE_SEAL.inpContrato).fill(this.access.nroContrato);
    await page.locator(LOGIN_PAGE_SEAL.btnBuscar).click();

    const dataElement = await page.waitForSelector(MAIN_PAGE_SEAL.tblData);
    const values = await  dataElement.evaluate(Utils.processTable);
    await dataElement.dispose();

    await new Promise(r => setTimeout(r,2000));
    
    const imageElement = await page.waitForSelector(MAIN_PAGE_SEAL.dvImage);
    await imageElement.screenshot({path: NameImage.SEAL});    
    await imageElement.dispose();

    await browser.close();
  
    return values;
  }
  async getData() {
    const values = await this.scraping();

    /**Tabla de las deudas */
    return values.slice(1).map(map => {
      return { 
        Suministro: map[0] || '', 
        Periodo: map[1] || '', 
        Cliente: map[2] || '', 
        Monto: +(map[3] || '0'), 
        Consumo: +(map[4] || '0'),
        Estado: (map[5] || ''), 
      };
    });
  }
}
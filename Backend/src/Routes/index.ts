import { Router } from "express";
import { FahrradController } from "../Controller/FahrradController";
import { Fahrrad } from "../Models/Fahrrad";

const router = Router();
const controller = new FahrradController();

router.post('/fahrrad/create', (req, res) => {
    //controller.saveFahrrad(fahrrad);
})

router.get('/fahrrad/readById', (req, res) => {
})

router.get('/fahrrad/readByString', (req, res) => {
})

router.get('/fahrrad/readByDate', (req, res) => {
})

router.get('/fahrrad/readAll', (req, res) => {
})

router.put('/fahrrad/update', (req, res) => {
})

router.delete('/fahrrad/deleteById', (req, res) => {
})
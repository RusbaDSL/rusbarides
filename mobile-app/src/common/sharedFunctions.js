import { React } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions } from 'react-native';
import { colors } from './theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from 'i18n-js';
import { api } from 'common';
import BidCabModal from '../components/BidCabModal';
import { Button, Icon } from 'react-native-elements';
import { fonts } from './font';
import { Tooltip } from 'react-native-elements';
import { useState } from 'react';
import { getLangKey } from 'common/src/other/getLangKey';

const { formatNumberInput, parseNumberInput, handleVietnameseNumberInput } = api;
var { height, width } = Dimensions.get('window');
export const MAIN_COLOR = colors.BIDTAXIPRIMARY;
export const MAIN_COLOR_DARK = colors.BIDTAXIPRIMARYDARK;
export const SECONDORY_COLOR = colors.BIDTAXISECONDORY;

export const appConsts = {
    needEmergemcy: true,
    hasMultiDrop: false,
    makePending: false,
    hasOptions: false,
    checkWallet: false,
    acceptWithAmount: true,
    hasStartOtp: true,
    canCall: true,
    showBookingOptions: false,
    captureBookingImage: false
}

export const checkSearchPhrase = (str) => {
    return str;
}

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

export const CarHorizontal = (props) => {
    const { t } = i18n;
    const { onPress, carData, styles, mode } = props;
    const [open, setOpen] = useState(false);

    return (
        <TouchableOpacity onPress={onPress} style={{ height: '100%', backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE }}>
            <View style={styles.imageStyle}>
                <Image resizeMode="contain" source={carData.image ? { uri: carData.image } : require('../../assets/images/microBlackCar.png')} style={styles.imageStyle1} />
            </View>
            <View style={styles.textViewStyle}>
                <Text style={[styles.text1, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t(getLangKey(carData.name.toUpperCase()))}</Text>
                {
                    carData.extra_info && carData.extra_info != '' ?
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
                                {
                                    carData.extra_info.split(',').map((ln) => <Text style={[styles.text2, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]} key={ln} >{truncateText(ln, 12)}</Text>)
                                }
                            </View>
                            <Tooltip style={{ marginLeft: 3, marginRight: 3 }}
                                backgroundColor={mode === 'dark' ? colors.PAGEBACK : colors.WHITE}
                                visible={open}
                                overlayColor={'rgba(50, 50, 50, 0.70)'}
                                height={100 + 30 * (carData.extra_info.split(',').length)}
                                width={100 + 30 * (carData.extra_info.split(',').length)}
                                skipAndroidStatusBar={true}
                                containerStyle={{ height: "auto", maxWidth: width - 20 }}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                popover={
                                    <View style={{ flexDirection: 'column', gap: 20, width: "100%", height: "100%" }}>
                                        {
                                            carData.extra_info.split(',').map((ln) => <Text style={{ fontFamily: fonts.Regular, color: mode === 'dark' ? colors.WHITE : colors.BLACK }} key={ln} >{ln}</Text>)
                                        }
                                    </View>
                                }>
                                <Icon
                                    name='information-circle-outline'
                                    type='ionicon'
                                    color={colors.BLUE}
                                    size={20}
                                />
                            </Tooltip>
                        </View>

                        : null
                }
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.text2, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const CarVertical = (props) => {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const { onPress, carData, settings, styles, mode } = props;
    return (
        <TouchableOpacity
            style={[styles.carContainer, { borderWidth: 2, borderColor: carData.active == true ? mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR : colors.SHADOW, flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE }]}
            onPress={onPress}
        >
            <Image
                source={carData.image ? { uri: carData.image } : require('../../assets/images/microBlackCar.png')}
                resizeMode="contain"
                style={styles.cardItemImagePlace}
            ></Image>
            <View style={[styles.bodyContent, { flexDirection: 'column', }]}>
                <Text style={[styles.titleStyles, { textAlign: isRTL ? 'right' : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t(getLangKey(carData.name.toUpperCase()))}</Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'column' }}>
                    {carData.extra_info && carData.extra_info != '' ?
                        <View style={{ justifyContent: 'space-around', marginLeft: 3, width: width - 180, }}>
                            {
                                carData.extra_info.split().map((ln) => <Text key={ln} style={[styles.text2, { fontFamily: fonts.Bold, color: mode === 'dark' ? colors.WHITE : colors.BLACK, textAlign: isRTL ? 'right' : 'left' }]} >{ln}</Text>)
                            }
                        </View>
                        : null}
                </View>
                <Text style={[styles.text2, { textAlign: isRTL ? 'right' : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
            </View>
        </TouchableOpacity>
    )
}


export const validateBookingObj = async (t, addBookingObj, instructionData, settings, bookingType, roundTrip, tripInstructions, tripdata, drivers, otherPerson, offerFare) => {
    const {
        getDistanceMatrix,
        GetDistance,
    } = api;
    addBookingObj['roundTrip'] = roundTrip;
    if (otherPerson) addBookingObj['instructionData'] = instructionData;
    addBookingObj['tripInstructions'] = tripInstructions;
    addBookingObj['offerFare'] = offerFare;
    if (settings.autoDispatch && bookingType == false) {
        let requestedDrivers = {};
        let driverEstimates = {};
        let startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
        let distArr = [];
        let allDrivers = [];
        if (drivers && drivers.length > 0) {
            for (let i = 0; i < drivers.length; i++) {
                let driver = { ...drivers[i] };
                let distance = GetDistance(tripdata.pickup.lat, tripdata.pickup.lng, driver.location.lat, driver.location.lng);
                if (settings.convert_to_mile) {
                    distance = distance / 1.609344;
                }
                if (distance < ((settings && settings.driverRadius) ? settings.driverRadius : 10) && driver.carType === tripdata.carType.name) {
                    driver["distance"] = distance;
                    allDrivers.push(driver);
                }
            }
            const sortedDrivers = settings.useDistanceMatrix ? allDrivers.slice(0, 25) : allDrivers;
            if (sortedDrivers.length > 0) {
                let driverDest = "";
                for (let i = 0; i < sortedDrivers.length; i++) {
                    let driver = { ...sortedDrivers[i] };
                    driverDest = driverDest + driver.location.lat + "," + driver.location.lng
                    if (i < (sortedDrivers.length - 1)) {
                        driverDest = driverDest + '|';
                    }
                }
                if (settings.useDistanceMatrix) {
                    distArr = await getDistanceMatrix(startLoc, driverDest);
                } else {
                    for (let i = 0; i < sortedDrivers.length; i++) {
                        distArr.push({ timein_text: ((sortedDrivers[i].distance * 2) + 1).toFixed(0) + ' min', found: true })
                    }
                }
                for (let i = 0; i < sortedDrivers.length; i++) {
                    if (distArr[i].found) {
                        let driver = {}
                        driver.id = sortedDrivers[i].id;
                        driver.distance = sortedDrivers[i].distance;
                        driver.timein_text = distArr[i].timein_text;
                        requestedDrivers[driver.id] = true;
                        driverEstimates[driver.id] = { distance: driver.distance, timein_text: driver.timein_text };
                    }
                }
                addBookingObj['requestedDrivers'] = requestedDrivers;
                addBookingObj['driverEstimates'] = driverEstimates;
            }
        } else {
            return { error: true, msg: t('no_driver_found_alert_messege') }
        }
    }
    return { addBookingObj };
}

export default function BookingModal(props) {
    return <BidCabModal {...props} />
}

export const prepareEstimateObject = async (tripdata, instructionData) => {
    const { t } = i18n;
    const {
        getDirectionsApi
    } = api;
    try {
        const startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
        const destLoc = tripdata.drop.lat + ',' + tripdata.drop.lng;
        let routeDetails = null;
        let waypoints = '';
        if (tripdata.drop && tripdata.drop.waypoints && tripdata.drop.waypoints.length > 0) {
            const origin = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
            const arr = tripdata.drop.waypoints;
            for (let i = 0; i < arr.length; i++) {
                waypoints = waypoints + arr[i].lat + ',' + arr[i].lng;
                if (i < arr.length - 1) {
                    waypoints = waypoints + '|';
                }
            }
            const destination = tripdata.drop.lat + ',' + tripdata.drop.lng;
            routeDetails = await getDirectionsApi(origin, destination, waypoints);
        } else {
            routeDetails = await getDirectionsApi(startLoc, destLoc, null);
        }
        const estimateObject = {
            pickup: { coords: { lat: tripdata.pickup.lat, lng: tripdata.pickup.lng }, description: tripdata.pickup.add },
            drop: { coords: { lat: tripdata.drop.lat, lng: tripdata.drop.lng }, description: tripdata.drop.add, waypointsStr: waypoints != '' ? waypoints : null, waypoints: waypoints != '' ? tripdata.drop.waypoints : null },
            carDetails: tripdata.carType,
            routeDetails: routeDetails
        };
        return { estimateObject };
    } catch (err) {
        return { error: true, msg: t('not_available') }
    }
}

export const ExtraInfo = (props) => {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const { estimate, item, uid, amount, setAmount, styles, onPressAccept, settings, mode, formatAmount } = props;
    const nextPrice = parseFloat((parseFloat(item.estimate) + parseFloat((item.estimate * 10) / 100)).toFixed(2));
    const prePrice = parseFloat((parseFloat(item.estimate) - parseFloat((item.estimate * 10) / 100)).toFixed(2));

    // Vietnamese number input support for bid amount
    const isVietnamese = settings?.country === "Vietnam";
    const displayAmount = isVietnamese && amount[item.id] ? formatNumberInput(amount[item.id], true) : (amount[item.id] && !isNaN(amount[item.id]) ? amount[item.id].toString() : null);

    const handleBidAmountChange = (value) => {
        if (isVietnamese) {
            handleVietnameseNumberInput(value, (numericValue, displayValue) => {
                let allAmts = { ...amount };
                allAmts[item.id] = numericValue.toString();
                setAmount(allAmts);
            });
        } else {
            let allAmts = { ...amount };
            allAmts[item.id] = value;
            setAmount(allAmts);
        }
    };
    return (
        <>
            <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={{ width: 'auto' }}>
                    <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('tripInstructions')} - </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                        {item ? (item.tripInstructions) : ''}
                    </Text>
                </View>
            </View>
            <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('roundTrip')} - </Text>
                <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                    {item.roundTrip ? t('yes') : t('no')}
                </Text>
            </View>
            <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('payment_mode')}</Text>
                <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                    {t(item.payment_mode)}
                </Text>
            </View>

            {
                (item.driver === uid) ?
                    <View style={[styles.textContainerStyle, styles.priceView, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={[styles.priceViewHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('trip_cost')} - </Text>
                        {settings.swipe_symbol === false ?
                            <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(item.trip_cost, settings.decimal, settings.country)}</Text>
                            :
                            <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(item.trip_cost, settings.decimal, settings.country)}{settings.symbol}</Text>
                        }
                    </View>
                    : <View style={styles.priceView}>
                        {
                            settings.disablesystemprice ?
                                (
                                    settings && !settings.coustomerBidPrice ?
                                        (
                                            item.customer_offer ?
                                                <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                    <Text style={[styles.priceViewHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('customer_offer')} - </Text>
                                                    {settings.swipe_symbol === false ?
                                                        <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(item.customer_offer, settings.decimal, settings.country)}</Text>
                                                        :
                                                        <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(item.customer_offer, settings.decimal, settings.country)}{settings.symbol}</Text>
                                                    }
                                                </View>
                                                :
                                                <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                    <Text style={[styles.priceViewHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('customer_offer')} - </Text>
                                                    {settings.swipe_symbol === false ?
                                                        <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(item.trip_cost, settings.decimal, settings.country)}</Text>
                                                        :
                                                        <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(item.trip_cost, settings.decimal, settings.country)}{settings.symbol}</Text>
                                                    }
                                                </View>
                                        )
                                        :
                                        null
                                )
                                : null
                        }
                    </View>
            }


            {settings && !settings.disablesystemprice ?
                <>
                    {item.status == 'NEW' && !(item.driverOffers && item.driverOffers[uid]) ?
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 10 }}>
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = prePrice;
                                    setAmount(allAmts);
                                    onPressAccept(item, prePrice);
                                }}
                                title={prePrice}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = item.estimate;
                                    setAmount(allAmts);
                                    onPressAccept(item, item.estimate);
                                }}
                                title={Math.round(item.estimate * 100) / 100}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = nextPrice;
                                    setAmount(allAmts);
                                    onPressAccept(item, nextPrice);
                                }}
                                title={nextPrice}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                        </View>
                        : null}
                </>
                : null}
            {item.status == 'NEW' && !(item.driverOffers && item.driverOffers[uid]) ?
                <View style={[styles.box, { backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE }]}>
                    <TextInput
                        style={[styles.dateTextStyle, { textAlign: isRTL ? "right" : "left", paddingHorizontal: 10, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                        placeholder={t('amount')}
                        placeholderTextColor={colors.SHADOW}
                        onChangeText={handleBidAmountChange}
                        value={displayAmount}
                        keyboardType={isVietnamese ? "default" : "number-pad"}
                    />
                </View>
                : null}
        </>
    )
}

export const RateView = (props) => {
    const { settings, item, uid, styles, formatAmount } = props;
    return (
        item && item.driverOffers && item.driverOffers[uid] ?
            <View style={styles.rateViewStyle}>
                {settings.swipe_symbol === false ?
                    <Text style={styles.rateViewTextStyle}>{settings.symbol}{formatAmount(item.driverOffers[uid].trip_cost, settings.decimal, settings.country)}</Text>
                    :
                    <Text style={styles.rateViewTextStyle}>{formatAmount(item.driverOffers[uid].trip_cost, settings.decimal, settings.country)}{settings.symbol}</Text>
                }
            </View>

            : null
    )
}
const styles = StyleSheet.create({
    rateViewTextStyle: {
        fontSize: 25,
        color: colors.BLACK,
        fontFamily: fonts.Bold,
        textAlign: "center"
    },
    rateViewStyle: {
        alignItems: 'center'
    },
});
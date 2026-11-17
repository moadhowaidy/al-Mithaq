import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { m, useReducedMotion } from 'framer-motion';
import { CircleAlert, CircleCheck, Info, Mail, MessageCircle } from 'lucide-react';
import {
  copy,
  cx,
  getProduct,
  getSector,
  isValidPhone,
  mailtoLink,
  products,
  productsInSector,
  sectors,
  toWesternDigits,
  whatsappLink,
} from '../../data';
import { useLanguage, useMountedBySwitch } from '../../data/i18n';
import Button from '../ui/Button';
import { Reveal, useSwitchHeading } from '../ui/Reveal';

type FieldName = 'name' | 'company' | 'phone' | 'quantity' | 'sector' | 'product' | 'details';
type Values = Record<FieldName, string>;
type ErrorCode = 'required' | 'invalidPhone';
type Errors = Partial<Record<FieldName, ErrorCode>>;
type Channel = 'whatsapp' | 'email';
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * The brief's order, on screen, for keyboard focus and in the quote message. From 768 px only
 * the name and company sit side by side; every other field runs the full width, so the grid has
 * no gaps and long sector and product names are never cut off.
 */
const FIELD_ORDER: FieldName[] = ['name', 'company', 'phone', 'sector', 'product', 'quantity', 'details'];
/** Every field is required except the product. */
const REQUIRED: FieldName[] = ['name', 'company', 'phone', 'quantity', 'sector', 'details'];
const EMPTY: Values = { name: '', company: '', phone: '', quantity: '', sector: '', product: '', details: '' };

/** Left-to-right mark: keeps "+218 91 …" in its order inside an Arabic (right-to-left) message. */
const LRM = String.fromCharCode(0x200e);

const fieldId = (name: FieldName) => `quote-${name}`;
const errorId = (name: FieldName) => `quote-${name}-error`;
const PRODUCT_HINT_ID = 'quote-product-hint';

/**
 * The visitor's entries, mirrored outside the component with the query they were typed under:
 * a language switch mounts the page again in the other language (same query), and the form picks
 * the entries up instead of starting empty. A different query (a new "Request a quote" arriving
 * right after a switch elsewhere) starts from the address instead.
 */
let draft: { search: string; values: Values } | null = null;

/** ?product=<id> selects the product and its sector; ?sector=<id> selects the sector. Unknown ids are ignored. */
function valuesFromAddress(params: URLSearchParams): Values {
  const product = getProduct(params.get('product'));
  if (product) return { ...EMPTY, sector: product.sector, product: product.id };
  const sector = getSector(params.get('sector'));
  return sector ? { ...EMPTY, sector: sector.id } : { ...EMPTY };
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  for (const name of REQUIRED) if (!values[name].trim()) errors[name] = 'required';
  if (!errors.phone && !isValidPhone(values.phone)) errors.phone = 'invalidPhone';
  return errors;
}

interface FieldProps {
  name: FieldName;
  label: string;
  error?: string;
  /** Extra note under the control (e.g. "No products listed in this sector yet"). */
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label, control and the inline message under it. */
function Field({ name, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={fieldId(name)} className="block text-[15px] font-medium leading-normal">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint}
      {error ? (
        <p id={errorId(name)} className="mt-2.5 flex items-start gap-2 text-[15px] font-semibold leading-normal">
          <CircleAlert aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * The quote request form, on a white card (id="quote", the target of every "Request a quote").
 * Pre-filled from ?product= or ?sector=, validated on submit with inline messages, an error
 * summary and focus on the first field to fix. Submitting opens WhatsApp Business with the
 * quote message; "or send by email" opens the visitor's email app with the same text.
 * There is no backend: nothing is stored or sent by the site itself.
 */
export default function QuoteForm() {
  const { lang, dir, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const mountedBySwitch = useMountedBySwitch();
  const reduceMotion = useReducedMotion();
  const switchHeading = useSwitchHeading(3);

  const search = searchParams.toString();
  const [values, setValues] = useState<Values>(() =>
    mountedBySwitch && draft?.search === search ? draft.values : valuesFromAddress(searchParams),
  );
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState<Channel | null>(null);
  const controls = useRef<Partial<Record<FieldName, Control | null>>>({});
  /** Field to focus once the failed attempt has rendered (so its error is announced with it). */
  const focusAfterRender = useRef<FieldName | null>(null);

  useEffect(() => {
    draft = { search, values };
  }, [search, values]);

  useEffect(() => {
    const name = focusAfterRender.current;
    focusAfterRender.current = null;
    const control = name ? controls.current[name] : null;
    if (!control) return;
    control.focus({ preventScroll: true });
    control.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [attempt, reduceMotion]);

  const sector = getSector(values.sector);
  const choices = sector ? productsInSector(sector.id) : products;
  const noProducts = Boolean(sector) && choices.length === 0;
  const hasErrors = Object.keys(errors).length > 0;

  const update = (name: FieldName, value: string) => {
    const next: Values = { ...values, [name]: value };
    // A product belongs to one sector: changing the sector clears a product from another one,
    // and choosing a product selects its sector.
    if (name === 'sector' && getProduct(next.product)?.sector !== value) next.product = '';
    if (name === 'product') {
      const product = getProduct(value);
      if (product) next.sector = product.sector;
    }
    setValues(next);
    // An edited request has not been sent yet: the "opened" note no longer applies.
    setSent(null);
    if (attempted) setErrors(validate(next));
  };

  /**
   * Props shared by every control: identity, value, error wiring and the focus handle.
   * The controls carry no `name`: the form is never submitted natively (autofill works from
   * `autoComplete`), so the visitor's details can never end up in an address bar or server log.
   */
  const bind = (name: FieldName) => ({
    id: fieldId(name),
    value: values[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? errorId(name) : undefined,
    ref: (node: Control | null) => {
      controls.current[name] = node;
    },
  });

  const errorText = (name: FieldName) => {
    const code = errors[name];
    return code ? t(copy.form[code]) : undefined;
  };

  /** The quote message, line by line as in the brief, in the current language. */
  const buildMessage = () => {
    const product = getProduct(values.product);
    const phone = toWesternDigits(values.phone.trim());
    const lines = [
      t(copy.form.messageTitle),
      `${t(copy.form.name)}: ${values.name.trim()}`,
      `${t(copy.form.company)}: ${values.company.trim()}`,
      `${t(copy.form.phone)}: ${lang === 'ar' ? LRM + phone : phone}`,
      `${t(copy.form.sector)}: ${sector ? t(sector.name) : ''}`,
    ];
    if (product) lines.push(`${t(copy.form.productLine)}: ${t(product.name)}`);
    lines.push(`${t(copy.form.quantity)}: ${values.quantity.trim()}`, `${t(copy.form.details)}: ${values.details.trim()}`);
    return lines.join('\n');
  };

  const send = (channel: Channel) => {
    const found = validate(values);
    const first = FIELD_ORDER.find((name) => found[name]);
    setAttempted(true);
    setErrors(found);
    if (first) {
      setSent(null);
      focusAfterRender.current = first;
      setAttempt((count) => count + 1);
      return;
    }
    const message = buildMessage();
    if (channel === 'whatsapp') {
      window.open(whatsappLink(message), '_blank', 'noopener');
    } else {
      window.location.href = mailtoLink(t(copy.form.messageTitle), message);
    }
    setSent(channel);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send('whatsapp');
  };

  /** The placeholder reads muted; the options stay navy. The disabled look comes from .field:disabled. */
  const selectClass = (empty: boolean) =>
    cx('field enabled:cursor-pointer [&_optgroup]:text-primary [&_option]:text-primary', empty && 'text-muted');

  return (
    <Reveal y={0} delay={0.12}>
      <section
        id="quote"
        aria-labelledby="quote-title"
        className="card -mx-[var(--gutter)] rounded-none border-x-0 px-[var(--gutter)] py-10 sm:mx-0 sm:rounded-2xl sm:border-x sm:p-10 xl:p-12"
      >
        <m.h2 id="quote-title" className="h2" {...switchHeading}>
          {t(copy.form.title)}
        </m.h2>
        <p className="mt-4 max-w-text text-balance text-muted">{t(copy.form.intro)}</p>

        <form noValidate onSubmit={onSubmit} className="mt-8 lg:mt-10">
          <div role="alert">
            {attempted && hasErrors ? (
              <p
                key={attempt}
                className="mb-8 flex items-start gap-3 border-s-2 border-primary bg-background py-4 pe-4 ps-5 font-medium leading-normal"
              >
                <CircleAlert aria-hidden="true" className="mt-[3px] h-5 w-5 shrink-0" strokeWidth={1.5} />
                <span>{t(copy.form.errorSummary)}</span>
              </p>
            ) : null}
          </div>

          <div className="grid gap-x-6 gap-y-7 md:grid-cols-2">
            <Field name="name" label={t(copy.form.name)} error={errorText('name')}>
              <input
                {...bind('name')}
                type="text"
                autoComplete="name"
                required
                className="field"
                onChange={(event) => update('name', event.target.value)}
              />
            </Field>

            <Field name="company" label={t(copy.form.company)} error={errorText('company')}>
              <input
                {...bind('company')}
                type="text"
                autoComplete="organization"
                required
                className="field"
                onChange={(event) => update('company', event.target.value)}
              />
            </Field>

            <Field name="phone" label={t(copy.form.phone)} error={errorText('phone')} className="md:col-span-2">
              <input
                {...bind('phone')}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                required
                className={cx('field font-num', dir === 'rtl' && 'text-right')}
                onChange={(event) => update('phone', event.target.value)}
              />
            </Field>

            <Field name="sector" label={t(copy.form.sector)} error={errorText('sector')} className="md:col-span-2">
              <select
                {...bind('sector')}
                required
                className={selectClass(!values.sector)}
                onChange={(event) => update('sector', event.target.value)}
              >
                <option value="">{t(copy.form.chooseSector)}</option>
                {sectors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {t(item.name)}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              name="product"
              label={t(copy.form.product)}
              className="md:col-span-2"
              hint={
                noProducts ? (
                  <p id={PRODUCT_HINT_ID} className="mt-2.5 flex items-start gap-2 text-[15px] leading-normal text-muted">
                    <Info aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span>{t(copy.form.noProducts)}</span>
                  </p>
                ) : null
              }
            >
              <select
                {...bind('product')}
                value={noProducts ? '' : values.product}
                disabled={noProducts}
                aria-describedby={noProducts ? PRODUCT_HINT_ID : undefined}
                className={selectClass(!values.product)}
                onChange={(event) => update('product', event.target.value)}
              >
                <option value="">{t(copy.form.chooseProduct)}</option>
                {sector
                  ? choices.map((product) => (
                      <option key={product.id} value={product.id}>
                        {t(product.name)}
                      </option>
                    ))
                  : sectors
                      .filter((item) => productsInSector(item.id).length > 0)
                      .map((item) => (
                        <optgroup key={item.id} label={t(item.name)}>
                          {productsInSector(item.id).map((product) => (
                            <option key={product.id} value={product.id}>
                              {t(product.name)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
              </select>
            </Field>

            <Field name="quantity" label={t(copy.form.quantity)} error={errorText('quantity')} className="md:col-span-2">
              <input
                {...bind('quantity')}
                type="text"
                autoComplete="off"
                required
                className="field"
                onChange={(event) => update('quantity', event.target.value)}
              />
            </Field>

            <Field name="details" label={t(copy.form.details)} error={errorText('details')} className="md:col-span-2">
              <textarea
                {...bind('details')}
                rows={5}
                required
                className="field"
                onChange={(event) => update('details', event.target.value)}
              />
            </Field>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4">
            <Button type="submit" icon={MessageCircle} className="w-full sm:w-auto">
              {t(copy.form.submit)}
            </Button>
            <button
              type="button"
              onClick={() => send('email')}
              className="inline-flex min-h-11 items-center justify-center gap-2.5 self-center text-[15px] font-medium sm:self-auto"
            >
              <Mail aria-hidden="true" className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
              <span className="link-inline">{t(copy.form.email)}</span>
            </button>
          </div>

          {/* Polite live region for the confirmation (the layout's language announcer is #language-status). */}
          <div role="status" aria-live="polite" aria-atomic="true">
            {sent ? (
              <p className="mt-6 flex items-start gap-3 text-[15px] leading-normal">
                <CircleCheck aria-hidden="true" className="mt-[2px] h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                <span>{t(sent === 'whatsapp' ? copy.form.opened : copy.form.openedEmail)}</span>
              </p>
            ) : null}
          </div>
        </form>
      </section>
    </Reveal>
  );
}
